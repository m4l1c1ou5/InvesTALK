const generateMessage=(msg,name)=>{
    console.log(name);
    let finalMessage={
        createdBy:name,
        message:msg,
        createdAt:new Date().getTime()
    };
    return finalMessage;
}
exports.generateMessage = generateMessage;