import {Assets} from "pixi.js";

export async function useAssetsLoader(){
    await Assets.load([
        {alias:"background",src:"/assets/background.png"},
        {alias:"stand",src:"/assets/Stand.png"},
        {alias:"arrow",src:"/assets/arrow.png"},
        {alias:"buttonBg",src:"/assets/button.png"},
        {alias:"wheelBase" ,src:"/assets/wheel.png"},
        {alias:"tileBg",src:"/assets/blue.png"},
        {alias:"tileBorder",src:"/assets/border.png"},
        {alias:"num_0" ,src:"/assets/zero.png"},
        {alias:"num_1",src:"/assets/one.png"},
        {alias:"num_2",src:"/assets/two.png"},
        {alias:"num_3",src:"/assets/three.png"},
        {alias:"num_4",src:"/assets/four.png"},
        {alias:"num_5",src:"/assets/five.png"},
        {alias:"num_6",src:"/assets/six.png"},
        {alias:"num_7",src:"/assets/seven.png"},
        {alias:"num_8",src:"/assets/eight.png"},
        {alias:"num_9",src:"/assets/nine.png"},
        {alias:"amount",src:"/assets/betamount.png"},
        {alias:"left",src:"/assets/lefts.png"},
        {alias:"right",src:"/assets/rights.png"},


    
    ])
}