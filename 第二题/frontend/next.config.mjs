/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // 允许导入不带扩展名的文件
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
    };
    
    return config;
  },
};

export default nextConfig;
