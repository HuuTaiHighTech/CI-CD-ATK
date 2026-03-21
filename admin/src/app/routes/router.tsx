import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '~/app/layouts';
import {
  BannerPage,
  BannerUpsert,
  BenefitPage,
  CategoryPage,
  CategoryUpsert,
  DashboardPage,
  ErrorBoundary,
  FeedbackPage,
  LoginPage,
  NotFoundPage,
  PartnerPage,
  PinProducts,
  PostPage,
  PostUpsert,
  ProductPage,
  ProductUpsert,
  ProjectPage,
  ProjectUpsert,
  SettingsPage,
  SocialPage,
  TagPage,
  TopProducts,
  UserPage
} from '~/app/pages';
import { GuestGuard, RoleGuard } from '~/app/routes/guards';
import {
  bannerLoader,
  categoryLoader,
  postLoader,
  productLoader,
  projectLoader
} from '~/app/routes/loaders';
import { ROUTES } from '~/constants';
import type {
  BannerForm,
  CategoryForm,
  PostForm,
  ProductForm,
  ProjectForm
} from '~/types';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
        handle: {
          title: 'Bảng điều khiển'
        }
      },
      {
        path: ROUTES.BANNERS,
        handle: {
          title: 'Hình ảnh'
        },
        children: [
          { index: true, element: <BannerPage /> },
          {
            path: ROUTES.CREATE,
            element: <BannerUpsert />,
            handle: {
              title: 'Thêm hình ảnh'
            }
          },
          {
            path: ROUTES.ID,
            element: <BannerUpsert />,
            loader: bannerLoader,
            handle: {
              title: ({ name }: BannerForm) => name || 'Chỉnh sửa hình ảnh'
            }
          }
        ]
      },
      {
        path: ROUTES.CATEGORIES,
        handle: { title: 'Danh mục' },
        children: [
          { index: true, element: <CategoryPage /> },
          {
            path: ROUTES.CREATE,
            element: <CategoryUpsert />,
            handle: { title: 'Thêm danh mục' }
          },
          {
            path: ROUTES.ID,
            element: <CategoryUpsert />,
            loader: categoryLoader,
            handle: {
              title: ({ i18n }: CategoryForm) =>
                i18n?.[0].name || 'Chỉnh sửa danh mục'
            }
          }
        ]
      },
      {
        path: ROUTES.PRODUCTS,
        handle: {
          title: 'Sản phẩm'
        },
        children: [
          { index: true, element: <ProductPage /> },
          {
            path: ROUTES.CREATE,
            element: <ProductUpsert />,
            handle: {
              title: 'Thêm sản phẩm'
            }
          },
          {
            path: ROUTES.ID,
            element: <ProductUpsert />,
            loader: productLoader,
            handle: {
              title: ({ i18n }: ProductForm) =>
                i18n?.[0].name || 'Chỉnh sửa sản phẩm'
            }
          }
        ]
      },
      {
        path: ROUTES.TAGS,
        element: <TagPage />,
        handle: {
          title: 'Thẻ'
        }
      },
      {
        path: ROUTES.BENEFITS,
        element: <BenefitPage />,
        handle: {
          title: 'Lợi ích'
        }
      },
      {
        path: ROUTES.POSTS,
        handle: {
          title: 'Bài đăng'
        },
        children: [
          { index: true, element: <PostPage /> },
          {
            path: ROUTES.CREATE,
            element: <PostUpsert />,
            handle: {
              title: 'Thêm bài viết'
            }
          },
          {
            path: ROUTES.ID,
            element: <PostUpsert />,
            loader: postLoader,
            handle: {
              title: ({ i18n }: PostForm) =>
                i18n?.[0].title || 'Chỉnh sửa bài viết'
            }
          }
        ]
      },
      {
        path: ROUTES.PROJECTS,
        handle: {
          title: 'Dự án tiêu biểu'
        },
        children: [
          { index: true, element: <ProjectPage /> },
          {
            path: ROUTES.CREATE,
            element: <ProjectUpsert />,
            handle: {
              title: 'Thêm dự án tiêu biểu'
            }
          },
          {
            path: ROUTES.ID,
            element: <ProjectUpsert />,
            loader: projectLoader,
            handle: {
              title: ({ i18n }: ProjectForm) =>
                i18n?.[0].name || 'Chỉnh sửa dự án tiêu biểu'
            }
          }
        ]
      },
      {
        path: ROUTES.PINPRODUCTS,
        element: <PinProducts />,
        handle: {
          title: 'Sản phẩm ghim'
        }
      },
      {
        path: ROUTES.TOPPRODUCTS,
        element: <TopProducts />,
        handle: {
          title: 'Sản phẩm nổi bật'
        }
      },
      {
        path: ROUTES.PARTNERS,
        element: <PartnerPage />,
        handle: {
          title: 'Đối tác'
        }
      },
      {
        path: ROUTES.SOCIALS,
        element: <SocialPage />,
        handle: {
          title: 'Mạng xã hội'
        }
      },
      {
        path: ROUTES.FEEDBACKS,
        element: <FeedbackPage />,
        handle: {
          title: 'Phản hồi'
        }
      },
      {
        path: ROUTES.SETTINGS,
        element: <SettingsPage />,
        handle: {
          title: 'Cài đặt'
        }
      },
      {
        element: <RoleGuard allowedRoles={['ADMIN']} />,
        children: [
          {
            path: ROUTES.USERS,
            element: <UserPage />,
            handle: {
              title: 'Người dùng'
            }
          }
        ]
      }
    ]
  },
  {
    element: <GuestGuard />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />
      }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);

export default router;
