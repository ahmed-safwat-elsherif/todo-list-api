const todoValidate = (data) =>{
    for (const key in data) {
        switch(key){
            case 'title':
                if(typeof data.title !== 'string'){
                    res.status(400).send({error:"invalid title",valid:false})
                    return false
                } else {
                    if(data.title.length < 10 || data.title.length >20){
                        res.status(400).send({error:"body should be between 10 to 20 characters",valid:false});
                        return false
                    }
                }
                break;
            case 'body':
                if(typeof data.body !== 'string'){
                    res.status(400).send({error:"invalid body",valid:false})
                    return false
                } else {
                    if(data.body.length < 10 || data.body.length >500){
                        res.status(400).send({error:"body should be between 10 to 500 characters",valid:false});
                        return false
                    }
                }
                break;
            case 'tags':
                if (data.tags.some((tag)=> typeof tag !=='string')){
                    res.status(400).send({error:"invalid fields", valid:false})
                    return false
                } else {
                    if(data.tags.some((tag) => tag.length > 10)){
                        res.status(400).send({error:"invalid "})
                        return false
                    }
                }
                break;
            default:
                break;
        }
    }
    return true
}

module.exports = {todoValidate}