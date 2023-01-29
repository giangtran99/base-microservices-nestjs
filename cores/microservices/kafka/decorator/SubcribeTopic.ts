

interface SubcribeTopicOptions {
    topic:string,
}


export function SubcribeTopic(options:SubcribeTopicOptions){
    return (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>)=>{
        setTimeout(()=>descriptor.value(),1000)
        
        //emit handled data 
    }
}