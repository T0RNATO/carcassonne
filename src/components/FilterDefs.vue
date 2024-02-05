<template>
    <svg class="w-0 h-0">
        <defs>
            <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.2" numOctaves="3"/>
                <feBlend in="" in2="SourceGraphic" mode="soft-light"/>
            </filter>

            <filter id='city'>
                <!-- Create noise -->
                <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="3" result="noise"/>
                <!-- Make noise black&white and transparent -->
                <feComponentTransfer in="" result="cn">
                    <feFuncR type="linear" slope="0.3"/>
                    <feFuncG type="linear" slope="0.1"/>
                    <feFuncB type="linear" slope="0.1"/>
                    <feFuncA type="linear" slope="0.35"/>
                </feComponentTransfer>
                <!-- Displace the border of the city -->
                <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="8" in="SourceGraphic" in2="noise"/>
                <!-- Apply noise on top for colour variation -->
                <feComposite in="cn" in2="" operator="atop"/>
            </filter>

            <!--Credit to Scott Turner from https://heredragonsabound.blogspot.com/2020/02/creating-pencil-effect-in-svg.html-->
            <filter x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" id="pencilTexture4">
                <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="1" result="f1"/>
                <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="8" in="SourceGraphic" in2="f1" result="f4"/>
                <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="10" result="f2"/>
                <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="5" in="SourceGraphic" in2="f2" result="f5"/>
                <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="2" seed="100" result="f3"/>
                <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="2" in="SourceGraphic" in2="f3" result="f6"/>
                <feBlend mode="multiply" in2="f4" in="f5" result="out1"/>
                <feBlend mode="multiply" in="out1" in2="f6" result="out2"/>
            </filter>
        </defs>
    </svg>
</template>