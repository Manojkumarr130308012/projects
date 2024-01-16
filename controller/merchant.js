const merchantSchema = require('../model/merchant');
const errorHandler = require('../utils/error.handler');

class BusinessController {
    async add(farm){
		try{
			let response = await merchantSchema.create(farm);
			return { status: "success",   msg:"Merchant Added successfully", result: response };
		} catch(error){
			return {
				status: "error",
				error: errorHandler.parseMongoError(error)
			};
		}
	}
	
	async fetch(){
		try{
			let response = await merchantSchema.find({});
			let count=Object.keys(response).length;
			return {
				response: response,
				count:count
			};
		} catch(error){
			return {
				status: "error",
				error: errorHandler.parseMongoError(error)
			};
		}
	}
  

	async fetchdata(id){
		try{
			let response = await merchantSchema.find({_id:id});
			return response;	
		} catch(error){
			return {
				status: "error",
				error: errorHandler.parseMongoError(error)
			};
		}
	}

	async delete(id){
		try{
			let response = await merchantSchema.deleteOne({_id: id});
			return {
				status: "success",
				response: response
			};
		} catch(error){
			return {
				status: "error",
				error: errorHandler.parseMongoError(error)
			};
		}
	}

	async update(id, body) {

        try {
            let response = await merchantSchema.update({_id: id}, body);
            return { status: "success", msg:"Merchant Updated successfully",result: response };

        } catch (error) {
            return { status: "error", error: error };
        }

    }
	
}

       

module.exports=new BusinessController();