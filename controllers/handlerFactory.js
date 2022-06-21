const CustomError = require("../utils/CustomError");

const MiniSearch = require('minisearch');
const Book = require("../models/bookModel");

exports.getAll =  (Model, options) => {
    return async (request, response, next) => {
        let documents = await Model.find().select(options);
        return response.status(200).json({
            status: 200,
            length: documents.length,
            data: {
                documents
            }
        });         
    }
}

exports.getOne = (Model) => {
    return async (request, response, next) => {
        const document = await Model.findById(request.params.id);
        if(!document) {
            return next(new CustomError(400, 'Document does not exist..'));
        }
        return response.status(200).json({
            status: 200,
            length: document.length,
            data: {
                document
            }
        });    
    }
}

exports.createOne = (Model) => {
    return async (request, response, next) => {
        let document = await Model.create(request.body);
        if(!document) { return next(new CustomError(400, 'Error Occured while creating document...')) }
        return response.status(201).json({
            status: 201,
            data: { document }
        })
    }
}

exports.updateOne = (Model) => {
    return async (request, response, next) => {
        let document = await Model.findByIdAndUpdate(request.params.id, request.body, { new: true });
        if(!document) {  return next(new CustomError(400, 'Document does not exist...')); }
        // let document = await Model.findOneAndUpdate({_id : request.params.id}, request.body, { new: true });
        return response.status(201).json({
            status: 201,
            data: { document }
        });
    }
}

exports.deleteOne = (Model) => {
    return async (request, response, next) => {
        let document = await Model.findByIdAndDelete(request.params.id);
        if(!document) {  return next(new CustomError(400, 'Document must exist to be deleted')); }
        return response.status(204).json({
            status: 204,
            message: `${Model} Deleted Successfully`
        });
    }
}

exports.deleteAll = (Model) => {
    return async (request, response, next) => {
        let documents = await Model.deleteMany();
        if(documents.deletedCount == 0) {
            return next(new CustomError(400, 'No Documents to delete...'));
        }
        return response.status(204).json({
            status: 204,
            message: `All Documents: ${Model} Deleted Successfully`
        });
    }
}

exports.search = (Model, options) => {
    return async (request, response, next) => {
        let documents = await Model.find();
        if(!documents) {
            return response.status(200).json({
                length: searchResults.length,
                data: {
                    results: searchResults
                }
            });
        }
        let miniSearch = new MiniSearch({
            fields: options.field,
            storeFields: options.storeField
        });
        miniSearch.addAll(documents);
        let searchResults = miniSearch.search(request.query.q);
        return response.status(200).json({
            length: searchResults.length,
            data: {
                results: searchResults
            }
        });
    }
}
