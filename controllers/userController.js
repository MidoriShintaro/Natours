// user handle
const User = require("./../models/userModels");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlefactory");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //1 create error if user POSTs password date
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updatePassword",
        400
      )
    );
  }
  //2 filtered out unwanted fields names that are not allowed to be update
  const filterBody = filterObj(req.body, "name", "email");
  //3 update user document
  const user = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: "true",
    runValidators: true,
  });
  console.log(user);
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.createNewUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "The route is not define. Please use /signUp",
  });
};

exports.getAllUser = factory.getAll(User);
exports.getUser = factory.getOne(User);
//do Not update password
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
