const chooseBtn = document.querySelector('#choose-btn');
const downloadBtn = document.querySelector('#download-btn');
const fileInput = document.querySelector('#fileInput');
const image = document.querySelector('#image');
const noImage = document.querySelector('.image-area');

let imgUrl = '';
let imgName = '';

function bindEvent() {
    chooseBtn.addEventListener('click', () => {
        fileInput.click();
    });
    downloadBtn.addEventListener('click', () => {
        const imagesHandler = new ImagesHandler(imgUrl);
        imagesHandler.blackWhite().then(() => imagesHandler.downloadImg(imgName));
    });
}

function init() {
    fileInput.addEventListener('change', (e) => {
        console.log();
        const file = e.target.files[0];
        if (file) {
            imgName = file.name;
            imgUrl = URL.createObjectURL(file);
            image.src = imgUrl;
            image.onload = () => {
                console.log(image.width);
                noImage.style.display = 'none';
                image.style.display = 'block';
            };

            downloadBtn.style.display = 'block';
        } else {
            imgName = '';
            imgUrl = '';
            image.src = imgUrl;
            image.style.display = 'none';
            noImage.style.display = 'flex';
            downloadBtn.style.display = 'none';
        }
    });
}

function start() {
    bindEvent();
    init();
}

start();
