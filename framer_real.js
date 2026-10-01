import{jsx as _jsx,jsxs as _jsxs,Fragment as _Fragment}from"react/jsx-runtime";import{addPropertyControls,ControlType,useIsStaticRenderer}from"framer";// Proper default size for Framer Marketplace
// @framerIntrinsicWidth 800
// @framerIntrinsicHeight 600
// @framerSupportedLayoutWidth any
// @framerSupportedLayoutHeight any
/**
 * Animated Background Tool – Optimized for Marketplace
 * Uses useIsStaticRenderer to disable animations on Canvas & Export
 */export default function AnimatedBackgroundTool(props){const{effect="Noise Gradient",color1="#3b82f6",color2="#a855f7",color3="#f472b6",animate=true}=props;// Disable all animations in static contexts (Canvas + Export)
const isStaticRenderer=useIsStaticRenderer();const shouldAnimate=animate&&!isStaticRenderer;const containerStyle={width:"100%",height:"100%",position:"relative",overflow:"hidden",minWidth:"100px",minHeight:"100px"};let backgroundContent;switch(effect){case"Noise Gradient":backgroundContent=/*#__PURE__*/_jsxs(_Fragment,{children:[/*#__PURE__*/_jsx("div",{style:{position:"absolute",inset:0,background:`linear-gradient(135deg, ${color1}, ${color2}, ${color3}, ${color1}, ${color2}, ${color3})`,backgroundSize:"500% 500%",animation:shouldAnimate?"gradientShift 12s ease infinite":"none"}}),/*#__PURE__*/_jsx("div",{style:{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 100%, ${color3} 12%, transparent 48%)`,opacity:.38,mixBlendMode:"screen"}}),/*#__PURE__*/_jsxs("svg",{style:{position:"absolute",inset:0,opacity:.28,mixBlendMode:"overlay"},width:"100%",height:"100%",children:[/*#__PURE__*/_jsx("defs",{children:/*#__PURE__*/_jsxs("filter",{id:"noise",x:"0%",y:"0%",width:"100%",height:"100%",children:[/*#__PURE__*/_jsx("feTurbulence",{type:"fractalNoise",baseFrequency:"0.85",numOctaves:"4",seed:"42",children:shouldAnimate&&/*#__PURE__*/_jsx("animate",{attributeName:"baseFrequency",values:"0.85;0.65;0.95;0.75;0.85",dur:"7s",repeatCount:"indefinite"})}),/*#__PURE__*/_jsx("feDisplacementMap",{in:"SourceGraphic",scale:"28",children:shouldAnimate&&/*#__PURE__*/_jsx("animate",{attributeName:"scale",values:"28;38;22;32;28",dur:"7s",repeatCount:"indefinite"})})]})}),/*#__PURE__*/_jsx("rect",{width:"100%",height:"100%",filter:"url(#noise)",fill:"#ffffff"})]})]});break;case"Lava/liquid Gradient":backgroundContent=/*#__PURE__*/_jsxs(_Fragment,{children:[/*#__PURE__*/_jsx("div",{style:{position:"absolute",inset:0,background:"#0a0500"}}),/*#__PURE__*/_jsx("div",{style:{position:"absolute",left:"-5%",top:"40%",width:"120%",height:"120%",background:`radial-gradient(circle at 40% 45%, ${color1} 15%, ${color2} 50%, transparent 75%)`,filter:"blur(65px)",opacity:.82,animation:shouldAnimate?"lavaBlob1 14s ease-in-out infinite":"none",borderRadius:"50%"}}),/*#__PURE__*/_jsx("div",{style:{position:"absolute",right:"-8%",bottom:"5%",width:"115%",height:"115%",background:`radial-gradient(circle at 60% 60%, ${color3} 20%, ${color2} 55%, transparent 80%)`,filter:"blur(60px)",opacity:.78,animation:shouldAnimate?"lavaBlob2 17s ease-in-out infinite":"none",borderRadius:"50%"}}),/*#__PURE__*/_jsx("div",{style:{position:"absolute",left:"15%",top:"55%",width:"85%",height:"85%",background:`radial-gradient(circle at 50% 50%, #fef08c 25%, ${color1} 60%, transparent 85%)`,filter:"blur(75px)",opacity:.68,animation:shouldAnimate?"lavaBlob3 11s ease-in-out infinite":"none",borderRadius:"50%"}}),/*#__PURE__*/_jsx("div",{style:{position:"absolute",left:"45%",top:"48%",width:"100%",height:"100%",background:`radial-gradient(circle at 35% 70%, ${color3} 12%, transparent 70%)`,filter:"blur(52px)",opacity:.72,animation:shouldAnimate?"lavaBlob4 20s ease-in-out infinite":"none",borderRadius:"50%"}})]});break;case"Halo Gradient":backgroundContent=/*#__PURE__*/_jsxs(_Fragment,{children:[/*#__PURE__*/_jsx("div",{style:{position:"absolute",inset:0,background:`radial-gradient(circle at 50% 100%, #1e1b4b 0%, #0f172a 70%)`}}),/*#__PURE__*/_jsx("div",{style:{position:"absolute",left:"12%",top:"52%",width:"80%",height:"80%",background:`radial-gradient(circle, ${color1} 20%, transparent 65%)`,filter:"blur(80px)",opacity:.68,animation:shouldAnimate?"haloPulse1 9s ease-in-out infinite":"none"}}),/*#__PURE__*/_jsx("div",{style:{position:"absolute",right:"10%",bottom:"15%",width:"70%",height:"70%",background:`radial-gradient(circle, ${color2} 16%, transparent 62%)`,filter:"blur(75px)",opacity:.62,animation:shouldAnimate?"haloPulse2 12s ease-in-out infinite":"none"}}),/*#__PURE__*/_jsx("div",{style:{position:"absolute",left:"32%",top:"48%",width:"65%",height:"65%",background:`radial-gradient(circle, ${color3} 22%, transparent 68%)`,filter:"blur(62px)",opacity:.55,animation:shouldAnimate?"haloPulse3 8s ease-in-out infinite":"none"}}),/*#__PURE__*/_jsx("div",{style:{position:"absolute",left:"8%",bottom:"22%",width:"52%",height:"52%",background:`radial-gradient(circle, ${color1} 28%, transparent 72%)`,filter:"blur(90px)",opacity:.45,animation:shouldAnimate?"haloPulse4 15s ease-in-out infinite":"none"}})]});break;}return /*#__PURE__*/_jsxs("div",{style:containerStyle,children:[backgroundContent,/*#__PURE__*/_jsx("style",{children:`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes lavaBlob1 {
          0%, 100% { transform: translate(0,0) scale(1.1) rotate(6deg); }
          50% { transform: translate(28%,18%) scale(0.85) rotate(-8deg); }
        }
        @keyframes lavaBlob2 {
          0%, 100% { transform: translate(0,0) scale(1.15); }
          50% { transform: translate(-32%,-22%) scale(0.8); }
        }
        @keyframes lavaBlob3 {
          0%, 100% { transform: translate(0,0) scale(0.9); }
          50% { transform: translate(35%,-28%) scale(1.25); }
        }
        @keyframes lavaBlob4 {
          0%, 100% { transform: translate(0,0) scale(1.05); }
          50% { transform: translate(-18%,38%) scale(0.82); }
        }

        @keyframes haloPulse1 {
          0%, 100% { transform: scale(0.8); opacity: 0.68; }
          50% { transform: scale(1.35); opacity: 0.92; }
        }
        @keyframes haloPulse2 {
          0%, 100% { transform: scale(0.85); opacity: 0.62; }
          50% { transform: scale(1.4); opacity: 0.88; }
        }
        @keyframes haloPulse3 {
          0%, 100% { transform: scale(1); opacity: 0.55; }
          50% { transform: scale(0.7); opacity: 0.82; }
        }
        @keyframes haloPulse4 {
          0%, 100% { transform: scale(0.9); opacity: 0.45; }
          50% { transform: scale(1.45); opacity: 0.75; }
        }
      `})]});}AnimatedBackgroundTool.defaultProps={effect:"Noise Gradient",color1:"#3b82f6",color2:"#a855f7",color3:"#f472b6",animate:true,width:800,height:600};addPropertyControls(AnimatedBackgroundTool,{effect:{type:ControlType.Enum,options:["Noise Gradient","Lava/liquid Gradient","Halo Gradient"],optionTitles:["Noise Gradient","Lava / Liquid Gradient","Halo Gradient"],title:"Effect",defaultValue:"Noise Gradient"},color1:{type:ControlType.Color,title:"Primary Color",defaultValue:"#3b82f6"},color2:{type:ControlType.Color,title:"Secondary Color",defaultValue:"#a855f7"},color3:{type:ControlType.Color,title:"Accent Color",defaultValue:"#f472b6"},animate:{type:ControlType.Boolean,title:"Animate Preview",defaultValue:true,description:"Turn off for static preview / export"}});
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"AnimatedBackgroundTool","slots":[],"annotations":{"framerSupportedLayoutHeight":"","framerIntrinsicWidth":"","framerSupportedLayoutWidth":"","framerIntrinsicHeight":"","framerContractVersion":"1"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./PlainBread_Studio_Animated_Backgrounds_V1.map