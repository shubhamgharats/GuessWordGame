export default function Keyboard(props){
            let bgColor="";
        if(props.isGuessed){
            bgColor= props.isCorrect ? "green":"red";
        }
    return(


        <>
            <button className="border h-10 w-10 " onClick={props.onClick} style={{backgroundColor: bgColor}}>{props.value}</button>
        </>
    )
}