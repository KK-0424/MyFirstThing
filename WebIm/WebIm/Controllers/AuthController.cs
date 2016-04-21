using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using MySql.Data.MySqlClient;
using WebIm.Models;
using WebIm.Modules;

namespace WebIm.Controllers
{
    public class AuthController : ApiController
    {
        public ResponseMsg<loginResponse> Login([FromBody]loginRequst data)
        {
            using (MySqlDb db = new MySqlDb())
            {
                ResponseMsg<loginResponse> r = new ResponseMsg<loginResponse>();
                data.password = MD5Helper.MD5Encrypt32(data.password);
                var result = db.registers.Where<register>(q => q.password == data.password && q.userName == q.userName);
                if (result.FirstOrDefault() == null)
                {
                    r.code = "0";
                    r.msg = "登录验证成功";
                }
                //md5 加密密码  验证用户名 获取数据
                return r;
            }
        }

        public ResponseMsg<loginResponse> Register([FromBody]register data)
        {
            using (MySqlDb db = new MySqlDb())
            {
                ResponseMsg<loginResponse> r = new ResponseMsg<loginResponse>();
                data.password = MD5Helper.MD5Encrypt32(data.password);
                data.userId = Guid.NewGuid().ToString("N");
                string para = data.ToInsertParameter();
                var result = db.registers.Where<register>(q => q.userName == data.userName);
                if (result.FirstOrDefault() == null)
                {
                    db.registers.Add(data);
                    db.SaveChanges();
                    r.code = "0";
                    r.msg = "注册成功";

                }
                else
                {
                    r.code = "2";
                    r.msg = "该用户名已被占用";
                }
                //md5 加密密码  验证用户名 获取数据
                return r;
            }
        }


    }
}