import { UserRepository } from '../repositories/User.repository';
import { UserService } from '../services/User.service';
import { UserController } from '../controllers/User.controller';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
export const userController = new UserController(userService);