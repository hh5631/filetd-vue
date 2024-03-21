
import { createRouter, createWebHistory } from 'vue-router';
import Register from '../view/Register.vue'
import Login from '../view/Login.vue'
import FileTD from '../view/FileTD.vue'

const routes = [
        {
          path: '/login',
          component:Login
        },
        {
          path: '/',
          component: Login
        },
        {
          path: '/register',
          component: Register
        },
        {
          path: '/filetd',
          component: FileTD
        }
      ];

const router=createRouter(
        {

          history: createWebHistory(),
          routes: routes,
        }
)



export default router
