class Application {
    constructor(elSelector, elTableSelector, outputToConsole) {
        this.el = document.querySelector(elSelector);
        this.elTable = document.querySelector(elTableSelector);
        this.slider = document.getElementById('slider');
        this.outputToConsole = outputToConsole;
        window.addEventListener('resize', () => {
            this.slider.scrollLeft = 0;
        });
    }
    log(msg) {
        if (this.outputToConsole) console.log(msg);
        this.el.insertAdjacentText('afterbegin', msg + "\n");
        this.el.parentNode.scrollTop = 0;
    }
    clear() {
        this.el.innerHTML = '';
    }
    toggleWrap() {
        const wrapped = this.el.classList.contains('wrap');
        if (wrapped)
            this.el.classList.remove('wrap');
        else
            this.el.classList.add('wrap');

    }
    setData(json) {
        this.data = json;
    }
    renderTable() {
        if (this.data == undefined) return;
        this.elTable.innerHTML = '';
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        let redIndx = 4;
        let urlIndx = 5;
        for (let i = 0; i < this.data.length; i++) {
            if (i == 0) {
                const keys = Object.keys(this.data[0]);
                let heads = '<tr>'
                for (let j = 0; j < keys.length; j++) {
                    if (j == redIndx) {
                        heads += `<th class="redirect">${keys[j]}</th>`;
                    } else if (j == urlIndx) {
                        heads += `<th class="url">${keys[j]}</th>`;
                    } else {
                        heads += `<th>${keys[j]}</th>`;
                    }
                }
                heads += '</tr>';
                thead.innerHTML = heads;
            }
            let row = document.createElement('tr');
            const values = Object.values(this.data[i]);
            for (let j = 0; j < values.length; j++) {
                let rowTxt = `<td>${values[j]}</td>`;
                if (j == redIndx) {
                    rowTxt = '<td class="redirect"><ul>';
                    for (let k = 0; k < values[j].length; k++) {
                        const url = values[j][k][0][2];
                        const type = values[j][k][1].replace(/\s+/g, '-').toLowerCase();
                        // console.log(type);
                        rowTxt += `<li class="${type}">${url}</li>`;
                    }
                    rowTxt += '</ul></td>';
                } else if (j == urlIndx) {
                    rowTxt = `<td><div class="url">${values[j]}</div></td>`;
                }
                row.insertAdjacentHTML('beforeend', rowTxt);
            }
            tbody.insertAdjacentElement('beforeend', row);
        }
        this.elTable.insertAdjacentElement('beforeend', thead);
        this.elTable.insertAdjacentElement('beforeend', tbody);
        document.querySelector(".url").addEventListener('click', (e) => { copyToClipboard(e.target.innerText) });
        document.querySelector(".redirect li").addEventListener('click', (e) => { copyToClipboard(e.target.innerText) });
    }
    switchDisplay() {
        const btn = document.getElementById('visualize');
        const ico = document.querySelector('#visualize > i');
        let delta = document.querySelector('tab').scrollWidth;
        const scroll = this.slider.scrollLeft;
        const canScroll = this.slider.scrollLeft == 0 || this.slider.scrollLeft == delta;
        if (canScroll) {
            if (scroll == 0) {
                ico.innerText = 'code';
            } else {
                ico.innerText = 'list_alt'
                delta = -delta;
            }
            this.slider.scrollBy({ left: delta, behavior: 'smooth' });
        }
    }
}
function copyToClipboard(text) {
    console.log(text);
    navigator.clipboard.writeText(text).then(()=>{
        console.log('Async: Copying to clipboard was successful!');
    }, (err)=>{
        console.error('Async: Could not copy text: ', err);
    });
}
// reads text returns json
function readJsonFile(files) {
    return new Promise((resolve, reject) => {
        if (files && files[0]) {
            const r = new FileReader();
            r.onload = (e) => {
                const jsonData = JSON.parse(e.target.result);
                return resolve(jsonData);
            }
            r.readAsText(files[0]);
        } else {
            reject('Invalid File!');
        }
    });
}
// reads json returns text
function readJsonUrl(file) {
    return new Promise((resolve, reject) => {
        fetch(file)
            .then((res) => res.json())
            .then((data) => {
                resolve(data);
            }).catch((err) => reject("Error: " + err));
    });
}

function getScrollbarDim(parentStr, childStr) {
    parent = document.querySelector(parentStr);
    child = document.querySelector(childStr);
    let width = parent.offsetWidth - child.offsetWidth;
    let height = parent.offsetHeight - child.offsetHeight;
    return { width, height };
}