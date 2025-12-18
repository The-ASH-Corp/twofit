import * as service from "./client.services.js";

export const getAllClients = async (req, res) => {
  try {
    const {page,limit}=req.params
    const clients = await service.getAllClient(page,limit);
    res.status(201).json({
      success: true,
      data: clients,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getSingleClient = async (req, res) => {
  try {
    const {id} = req.params;
    const client = await service.getSingleClient(id);
    res.status(200).json({
        success: true,
        data : client,
    })
  } catch (error) {
    res.status(400).json({ success: false, message: err.message });
  }
};


export const updateClient = async (req, res) => {
  try {
    const {id} = req.params
    const updatedClient =await service.updateOneClient(req.body,id)
    res.status(200).json({success: true, data: updatedClient})
  } catch (error) {
    res.status(400).json({ success: false, message: err.message });
  }
}

export const deleteClient = async (req, res) => {
  try {
    const {id} = req.params
    const deleteClient = await service.deleteOneClient(id)
    res.status(200).json({success:true})
  } catch (error) {
    res.status(400).json({ success: false, message: err.message });
  }
}