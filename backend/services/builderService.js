const builderRepository = require("../repositories/builderRepository");

const createBuilder = async (
  name,
  email,
  skills,
  bio,
  userId
) => {
  if (!name || !email || !skills || skills.length === 0) {
    throw new Error(
      "Name, email, and at least one skill are required"
    );
  }

 try {
  return await builderRepository.createBuilder(
    name,
    email,
    skills,
    bio,
    userId
  );
} catch (error) {
  if (error.code === "23505") {
    throw new Error(
      "You already have a builder profile."
    );
  }

  throw error;
}
};

const getAllBuilders = async () => {
  return await builderRepository.getAllBuilders();
};

const getBuilderById = async (builderId) => {
  if (!builderId) {
    throw new Error("Builder ID is required");
  }

  const builder =
    await builderRepository.getBuilderById(builderId);

  if (!builder) {
    throw new Error("Builder not found");
  }

  return builder;
};

module.exports = {
  createBuilder,
  getAllBuilders,
  getBuilderById,
};