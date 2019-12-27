"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const leanengine_1 = require("leanengine");
const Role_1 = require("./Role");
let UserController = class UserController {
    async getList({ currentUser }, pageSize = 10, pageIndex = 1) {
        if (!currentUser)
            throw new routing_controllers_1.UnauthorizedError();
        if (!(await Role_1.RoleController.isAdmin(currentUser)))
            throw new routing_controllers_1.ForbiddenError();
        const list = await new leanengine_1.Query(leanengine_1.User)
            .limit(pageSize)
            .skip(pageSize * --pageIndex)
            .find({ useMasterKey: true });
        return list.map(item => item.toJSON());
    }
    async getOne(id) {
        const user = await new leanengine_1.Query(leanengine_1.User).get(id);
        const roles = (await user.getRoles()).map(item => item.toJSON());
        return Object.assign(Object.assign({}, user.toJSON()), { roles });
    }
    async addRole({ currentUser }, id, rid) {
        const role = await new leanengine_1.Query(leanengine_1.Role).get(rid);
        role.getUsers().add(leanengine_1.Object.createWithoutData('_User', id));
        await role.save(null, { user: currentUser });
    }
    async removeRole({ currentUser }, id, rid) {
        const role = await new leanengine_1.Query(leanengine_1.Role).get(rid);
        role.getUsers().remove(leanengine_1.Object.createWithoutData('_User', id));
        await role.save(null, { user: currentUser });
    }
};
__decorate([
    routing_controllers_1.Get(),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.QueryParam('pageSize')),
    __param(2, routing_controllers_1.QueryParam('pageIndex')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getList", null);
__decorate([
    routing_controllers_1.Get('/:id'),
    __param(0, routing_controllers_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getOne", null);
__decorate([
    routing_controllers_1.Post('/:id/role/:rid'),
    routing_controllers_1.OnUndefined(201),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('id')),
    __param(2, routing_controllers_1.Param('rid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "addRole", null);
__decorate([
    routing_controllers_1.Delete('/:id/role/:rid'),
    routing_controllers_1.OnUndefined(204),
    __param(0, routing_controllers_1.Ctx()),
    __param(1, routing_controllers_1.Param('id')),
    __param(2, routing_controllers_1.Param('rid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeRole", null);
UserController = __decorate([
    routing_controllers_1.JsonController('/user')
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=User.js.map