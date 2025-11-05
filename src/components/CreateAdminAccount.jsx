import React, { useEffect } from 'react';
import { useRegister } from '../hooks/api/useAuth';
import { useUpdateUser } from '../hooks/api/useUser';
import { toast } from 'react-toastify';

/**
 * Component tạm thời: Dùng để tạo tài khoản admin
 * Sử dụng hook useRegister để đăng ký user, sau đó dùng hook useUpdateUser để set quyền admin
 */
const CreateAdminAccount = () => {
  const registerMutation = useRegister();
  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    const createAdminAccount = async () => {
      // Kiểm tra xem đã thử tạo chưa (dùng localStorage để tránh tạo lại)
      const hasAttempted = localStorage.getItem('adminAccountCreationAttempted');
      if (hasAttempted === 'true') {
        console.log('Đã thử tạo tài khoản admin, bỏ qua');
        return;
      }

      try {
        // Bước 1: Sử dụng hook useRegister để đăng ký user
        console.log('Đang đăng ký tài khoản admin...');
        const registerResponse = await registerMutation.mutateAsync({
          name: 'Admin',
          email: 'admin123@gmail.com',
          password: 'Admin123!',
        });

        if (registerResponse?.data?.user?._id) {
          const userId = registerResponse.data.user._id;
          console.log('Đăng ký thành công, User ID:', userId);

          // Bước 2: Sử dụng hook useUpdateUser để set user thành admin
          try {
            console.log('Đang thiết lập quyền admin cho user...');
            await updateUserMutation.mutateAsync({
              id: userId,
              body: {
                isAdmin: true,
              },
            });

            console.log('Tạo tài khoản admin thành công!');
            toast.success('Tạo tài khoản admin thành công!\nEmail: admin123@gmail.com\nPassword: Admin123!');
            localStorage.setItem('adminAccountCreationAttempted', 'true');
          } catch (updateError) {
            // Nếu update thất bại (có thể do cần quyền admin), ít nhất user đã được tạo
            console.warn('Không thể set quyền admin (có thể cần quyền admin):', updateError);
            toast.warning(
              'Tài khoản đã được tạo, nhưng không thể tự động set quyền admin.\n' +
              'Email: admin123@gmail.com\n' +
              'Password: Admin123!\n' +
              'Vui lòng set isAdmin: true trong database hoặc dùng tài khoản admin khác để set.'
            );
            localStorage.setItem('adminAccountCreationAttempted', 'true');
          }
        } else {
          throw new Error('Phản hồi đăng ký không có User ID');
        }
      } catch (error) {
        console.error('Lỗi khi tạo tài khoản admin:', error);
        
        // Kiểm tra xem có phải do user đã tồn tại không
        const errorMessage = error?.message || error?.response?.data?.message || '';
        if (errorMessage.includes('already exists') || 
            errorMessage.includes('已存在') ||
            errorMessage.includes('duplicate') ||
            errorMessage.includes('đã tồn tại')) {
          toast.info('Tài khoản admin có thể đã tồn tại. Nếu chưa set quyền admin, vui lòng set isAdmin: true trong database');
        } else {
          toast.error('Tạo tài khoản admin thất bại: ' + errorMessage);
        }
        localStorage.setItem('adminAccountCreationAttempted', 'true');
      }
    };

    // Trì hoãn thực thi để đảm bảo app đã load hoàn toàn
    const timer = setTimeout(() => {
      createAdminAccount();
    }, 1000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Chỉ chạy một lần khi component mount

  // Component này không render gì
  return null;
};

export default CreateAdminAccount;

