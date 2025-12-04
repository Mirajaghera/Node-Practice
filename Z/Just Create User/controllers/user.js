const UserData = require("../models/user");

async function getAllUsers(req, res) {
  const UserDetails = await UserData.find({});
  return res.json(UserDetails);
}
async function getUserById(req, res) {
  const userData = await UserData.findById(req.params.id);
  return res.json(userData);
}
async function updateUserById(req, res) {
  // to update in mogodb await UserData.findByIdAndUpdate(res.params.id,{last_name:"Nothin"})
  const getData = res.body;
  const id = Number(res.params.id);
  const index = Data.findIndex((index) => index.id === id);
  Data.splice(index, 1, { ...getData, id: id });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(Data), (error, ef) => {
    return req.json({ status: "Succes" });
  });
}
async function deleteUserById(req, res) {
  await UserData.findByIdAndDelete(req.params.id);
  return res.json({ status: "Succes" });
}

async function createUser(req, res) {
  const getData = req.body;
  //console.log({ ...getData, id: Data.length + 1 });
  if (
    getData.first_name &&
    getData.last_name &&
    getData.email &&
    getData.job_title &&
    getData.gender
  ) {
    await UserData.create({
      firstName: getData.first_name,
      lastName: getData.last_name,
      email: getData.email,
      job_title: getData.job_title,
      gender: getData.gender,
    });
    return res.status(201).json({ status: "Succes", id: UserData.id });
  } else {
    console.log(
      getData.first_name,
      getData.last_name,
      getData.email,
      getData.job_title,
      getData.gender
    );
    return res.json({ message: "User Details are missing", status: false });
  }
}
module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createUser,
};
