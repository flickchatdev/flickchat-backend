class UserRepository {
  findById = async (id: string) => {};
  findByPhoneNumber = async (phoneNumber: string) => {};
  create = async (userData: any) => {};
  update = async (id: string, userData: any) => {};
  delete = async (id: string) => {};
}

export default new UserRepository();
