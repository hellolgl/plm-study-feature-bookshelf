import {GriddingClass} from "./GraphAndNumAlgorithm"
import {DrawSvgClass} from "./GraphAndNumSVG"

const log = console.log.bind(console)

class Grad {
    static draw = (width, height, gridNumsPixels) => {
        const grad = new GriddingClass(width, height, 0, height, gridNumsPixels)
        const draw = new DrawSvgClass(width, height)
        draw.DrawGriddingSvg(grad.img_x_mat, grad.img_y_mat, [grad.origin_x, grad.origin_y])
        return draw.gridding_svg_mat
    }
}

export default Grad