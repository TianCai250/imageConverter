class ImagesHandler {
    constructor(imgSrc, options = {}) {
        this.imgSrc = imgSrc;
        this.target = options.target || null;
        this.width = options.width || null;
        this.height = options.height || null;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.image = new Image();
        this.image.src = this.imgSrc;
        // 如果有容器，则绘制在容器中
        if (this.target) {
            this.target.innerHTML = '';
            this.target.append(this.canvas);
        }
    }
    // 黑白处理
    blackWhite() {
        return new Promise((resolve) => {
            this.image.onload = () => {
                this.canvas.width = this.width || this.image.width;
                this.canvas.height = this.height || this.image.height;
                this.context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
                // 1.获取图像信息
                let imgdata = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
                // 图像的总通道
                let pixels = imgdata.data.length;
                // 2.遍历每一个像素
                for (let i = 0; i < pixels; i += 4) {
                    // 3.将每个像素的所有通道的值按权平均,和中性灰的色值进行对比
                    // 当前的r,g,b色值
                    let r = imgdata.data[i],
                        g = imgdata.data[i + 1],
                        b = imgdata.data[i + 2];
                    // 计算结果值
                    let val = r * 0.299 + g * 0.587 + b * 0.114 >= 128 ? 255 : 0;
                    // 黑白后的r,g,b色值
                    imgdata.data[i] = val;
                    imgdata.data[i + 1] = val;
                    imgdata.data[i + 2] = val;
                }
                // 4.把处理后的像素信息放回画布
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.context.putImageData(imgdata, 0, 0);
                resolve(this.image);
            };
        });
    }
    // 下载转化后的图片(在blackWhite的then回调函数中使用):imagesHandler.blackWhite().then(img => imagesHandler.downloadImg())
    downloadImg(imgName) {
        this.canvas.toBlob((blob) => {
            const timestamp = Date.now().toString();
            const a = document.createElement('a');
            document.body.append(a);
            a.download = imgName ? imgName : new Date().getTime() + '.png';
            a.href = URL.createObjectURL(blob);
            a.click();
            a.remove();
        });
    }
    // 用指定dom绘制图片
    paintByElement(container, options) {
        const image = new Image();
        image.src = this.imgSrc;
        // 绘制的宽高
        const width = options.width || this.canvas.width;
        const height = options.height || this.canvas.height;
        // 填充元素
        const element = options.element || null;
        // 元素之间的间距
        const gap = options.gap || 6;
        // 元素放大倍数
        const scale = options.scale || 1;
        // 元素宽
        const elSize = options.elSize || 5;
        if (!element) {
            throw '选项element不能为空！';
        }
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        image.onload = () => {
            ctx.drawImage(image, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height).data;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
            container.innerHTML = '';
            // // 生成点阵信息
            for (var h = 0; h < height; h += gap) {
                for (var w = 0; w < width; w += gap) {
                    var position = (width * h + w) * 4;
                    var r = imageData[position],
                        g = imageData[position + 1],
                        b = imageData[position + 2];
                    if (r * 0.299 + g * 0.587 + b * 0.114 < 128) {
                        let el = element.cloneNode(true);
                        el.style.position = 'absolute';
                        el.style.left = w * scale - elSize / 2 + 'px';
                        el.style.top = h * scale - elSize / 2 + 'px';
                        el.style.width = el.style.height = elSize + 'px';
                        container.appendChild(el);
                    }
                }
            }
        };
    }
}
