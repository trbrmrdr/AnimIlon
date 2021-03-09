/*
Не используется
 */
class GradientResource extends PIXI.Resource {
    constructor() {
        // pass width and height. (0,0) if we dont know yet
        // gradient needs only 1 pixel height
        super(1, 256);
    }

    upload(renderer, baseTexture, glTexture) {
        const { width } = this; // default size or from baseTexture?
        const { height } = this; // your choice.

        // temporary canvas, we dont need it after texture is uploaded to GPU
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        // ctx.fillStyle = '#000000';
        // ctx.fillRect(0, 0, width, height);

        const grd = ctx.createLinearGradient(0, 0, 0, height);
        grd.addColorStop(1, '#81002A');
        grd.addColorStop(0.644, '#5431B9');
        grd.addColorStop(0.2956, '#2F1439');
        grd.addColorStop(0, '#001400');

        ctx.fillStyle = grd
        ctx.fillRect(0, 0, width, height);

        // This info ios usseful if upload happens second time
        // Some people use that to track used memory
        glTexture.width = width;
        glTexture.height = height;

        // PURE WEBGL CALLS - that's what its all about.
        // PixiJS cant wrap all that API, we give you acceess to it!
        const { gl } = renderer;
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.premultiplyAlpha);
        gl.texImage2D(baseTexture.target, 0, baseTexture.format, baseTexture.format, baseTexture.type, canvas);

        return true;
    }
}
