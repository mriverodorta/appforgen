// requires admin\admin.module.js
namespace appforgen.about {
  'use strict';

  interface IAdminVm {
    title: string;
  }
  export class AdminController implements IAdminVm {
    title: string = 'Admin';

    static $inject: Array<string> = ['logger'];
    constructor() {
      console.log('lalala');
    }
  }

  angular
    .module('appforgen.admin')
    .controller('AdminController', AdminController);
}
