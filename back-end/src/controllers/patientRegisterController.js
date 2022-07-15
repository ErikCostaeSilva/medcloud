const {Register}=require("../models/RegisterModel");
const {RegisterModel}=require("../models/RegisterModel");
//C
exports.register = async (req, res) => {
  try{
  const {name,email,birthDate,address}=req.body;
  const RegisterPatients=new Register({name,email,birthDate,address});
  await RegisterPatients.register();
  if(!RegisterPatients.user){
    return res.status(201).json({cannotBeCreated:"Paciente não pode ser criado."});
  }
  if(RegisterPatients.errors.length>0){
    return res.status(201).json({alreadyExist:"Ocorreu um erro.Verifique se o E-mail ou o nome ja foram cadastrados."})
  }

  return res.status(201).json(RegisterPatients.user);
  }catch(e){
    res.status(405).json("Ocorreu um erro na criação.Tente novamente mais tarde.")
  }
};
//R
exports.getListPatients=async (req,res)=>{
  try{
  const datas=await RegisterModel.find();
  return res.status(200).json(datas)
  }catch(e){
    res.status(503).json("Servidor encontra-se temporariamente indisponível.");
  }
}
exports.getPatientByIdParams=async (req,res)=>{
  try{
  const {editId}=req.params
  const data=await RegisterModel.findOne({_id:editId});
  return res.status(200).json(data);
  }catch(e){
    res.status(503).json("Servidor encontra-se temporariamente indisponível.");
  }
}
//U
exports.updatePatient=async (req,res)=>{
  try{
  const {name,email,birthDate,address,_id}=req.body;
  if(!_id){
    return res.status(400).json("Id is mandatory");
  }
  const userAlreadyExist=RegisterModel.findOne({_id:_id});
  if(!userAlreadyExist){
    return res.status(404).json("User not exist");
  }
  const user=await RegisterModel.findOneAndUpdate({_id:_id},{name,email,birthDate,address});
  return res.status(200).json(user);
  }catch(e){
    res.status(426).json("Não foi possível atualizar os dados no momento.");
  }
}
//D
exports.deletePatient=async (req,res)=>{
  try{
  const {id}=req.params
  if(!id){
    return res.status(400).json("Id is mandatory");
  }
  const userAlreadyExist=RegisterModel.findOne({id});
  if(!userAlreadyExist){
    return res.status(404).json("User not exist");
  }
  await RegisterModel.findOneAndDelete({_id:id});
  return res.status(200).send("Paciente deletado com sucesso");
  }catch(e){
    res.status(406).json("Não foi possível deletar os dados no momento.");
  }
}