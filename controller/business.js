const businessSchema = require('../model/business');
const errorHandler = require('../utils/error.handler');

class BusinessController {
    async add(farm){
		try{
			let response = await businessSchema.create(farm);
			return { status: "success",   msg:"Business Added successfully", result: response };
		} catch(error){
			return {
				status: "error",
				error: errorHandler.parseMongoError(error)
			};
		}
	}
	
	async fetch(){
		try{

            
			let response = await businessSchema.find({});
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
			let response = await businessSchema.find({_id:id});
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
			let response = await businessSchema.deleteOne({_id: id});
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
            let response = await businessSchema.update({_id: id}, body);
            return { status: "success", msg:"Business Updated successfully",result: response };

        } catch (error) {
            return { status: "error", error: error };
        }

    }
	
}

       

module.exports=new BusinessController();