import React from 'react'

export default function Kaktus(props) {
console.log(props.mouthrotate)
    return (
        <div class="container">
              
        <div class="ground"></div>
        <div class="pot"></div>
        <div class="cactus">
            <div class="eye" ></div>
            <div class="mouth" style={{ transform: `rotate(-${props.mouthrotate}deg)` }}></div>
            <div class="flower">
                <div class="petals">
                    <div class="dot"></div>
                </div>
            </div>
        </div>
    </div>
    )
}
// transform: rotate(-180deg);
