using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace WebIm
{
    public class MD5Helper
    {
        /// <summary>
        /// MD5加密方法
        /// </summary>
        /// <param name="oldpwd">要加密的字符串</param>
        /// <returns>加密之后的字符串</returns>
        private string GetMD5String(string oldpwd)
        {
            string newPwd = string.Empty;//声明一个字符串来存放加密后的字符串
            byte[] result = Encoding.Default.GetBytes(oldpwd);//把要加密的字符串通过默认编码转换成byte[]类型
            MD5 md5 = new MD5CryptoServiceProvider();//创建一个用于MD5加密的类
            byte[] output = md5.ComputeHash(result);// 对字符串进行加密
            newPwd = BitConverter.ToString(output).Replace("-", "");//将加密后的字节数组转成字符串并去掉横杠

            return newPwd;//返回新的加密字符串//发送
        }

        /// <summary>
        /// 16位MD5加密
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        public static string MD5Encrypt16(string password)
        {
            var md5 = new MD5CryptoServiceProvider();
            string t2 = BitConverter.ToString(md5.ComputeHash(Encoding.Default.GetBytes(password)), 4, 8);
            t2 = t2.Replace("-", "");
            return t2;
        }

        /// <summary>
        /// 32位MD5加密
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        public static string MD5Encrypt32(string password)
        {
            string cl = password;
            string pwd = "";
            MD5 md5 = MD5.Create(); //实例化一个md5对像
            // 加密后是一个字节类型的数组，这里要注意编码UTF8/Unicode等的选择　
            byte[] s = md5.ComputeHash(Encoding.UTF8.GetBytes(cl));
            // 通过使用循环，将字节类型的数组转换为字符串，此字符串是常规字符格式化所得
            for (int i = 0; i < s.Length; i++)
            {
                // 将得到的字符串使用十六进制类型格式。格式后的字符是小写的字母，如果使用大写（X）则格式后的字符是大写字符 
                pwd = pwd + s[i].ToString("X");
            }
            return pwd;
        }

        public static string MD5Encrypt64(string password)
        {
            string cl = password;
            //string pwd = "";
            MD5 md5 = MD5.Create(); //实例化一个md5对像
            // 加密后是一个字节类型的数组，这里要注意编码UTF8/Unicode等的选择　
            byte[] s = md5.ComputeHash(Encoding.UTF8.GetBytes(cl));
            return Convert.ToBase64String(s);
        }
    }
}