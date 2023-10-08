import Layout from '@/layout/index.vue'
export const constantRoute = [
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      title: '登录',
      isShow: false,
    },
  },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: {
      title: '',
      isShow: false,
    },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
          isShow: true,
        },
      },
    ],
  },
  // 数据大屏
  {
    path: '/screen',
    name: 'screen',
    component: () => import('@/views/screen/index.vue'),
    meta: {
      title: '数据大屏',
      icon: 'Monitor',
      isShow: true,
    },
  },
  // 权限管理
  {
    path: '/acl',
    name: 'acl',
    component: Layout,
    redirect: '/acl/user',
    meta: {
      title: '权限管理',
      icon: 'Lock',
      isShow: true,
    },
    children: [
      // 用户管理
      {
        path: '/acl/user',
        name: 'user',
        component: () => import('@/views/acl/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'User',
          isShow: true,
        },
      },
      // 角色管理
      {
        path: '/acl/role',
        name: 'role',
        component: () => import('@/views/acl/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'Avatar',
          isShow: true,
        },
      },
      // 菜单管理
      {
        path: '/acl/permission',
        name: 'permission',
        component: () => import('@/views/acl/permission/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'Grid',
          isShow: true,
        },
      },
    ],
  },
  // 商品管理
  {
    path: '/product',
    name: 'product',
    component: Layout,
    redirect: '/product/spu',
    meta: {
      title: '商品管理',
      icon: 'Goods',
      isShow: true,
    },
    children: [
      // spu管理
      {
        path: '/product/spu',
        name: 'spu',
        component: () => import('@/views/product/spu/index.vue'),
        meta: {
          title: 'spu管理',
          icon: 'Memo',
          isShow: true,
        },
      },
      // sku管理
      {
        path: '/product/sku',
        name: 'sku',
        component: () => import('@/views/product/sku/index.vue'),
        meta: {
          title: 'sku管理',
          icon: 'Collection',
          isShow: true,
        },
      },
      // 品牌管理
      {
        path: '/product/trademark',
        name: 'trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        meta: {
          title: '品牌管理',
          icon: 'SuitcaseLine',
          isShow: true,
        },
      },
      // 属性管理
      {
        path: '/product/attr',
        name: 'attr',
        component: () => import('@/views/product/attr/index.vue'),
        meta: {
          title: '属性管理',
          icon: 'List',
          isShow: true,
        },
      },
    ],
  },
]
