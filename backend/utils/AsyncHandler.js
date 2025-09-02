const AsyncHandler  =  (callbackFunction) => {
    return async (req,res,next) => {
        try{
            await callbackFunction(req,res)
        }catch (error){
            next(error)
        }
    }
}

module.exports = AsyncHandler;