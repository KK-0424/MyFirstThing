using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data.MySqlClient;

namespace WebIm
{
    public static class MysqlParaHelper
    {
        public static MySqlParameter[] ToParameter(this Object obj)
        {
            List<MySqlParameter> para = new List<MySqlParameter>();
            foreach (var o in obj.GetType().GetProperties())
            {
                para.Add(new MySqlParameter("?" + o.Name, o.PropertyType.ToMysqlType()) { Value = o.GetValue(obj, null) });
            }
            return para.ToArray();
        }

        public static string ToInsertParameter(this Object obj)
        {
            string paras = "(";
            string values = "(";
            foreach (var o in obj.GetType().GetProperties())
            {
                var value = o.GetValue(obj, null);
                if (value != null)
                {
                    paras += o.Name + ",";
                    values += "'" + value + "',";
                }

            }
            paras = paras.Substring(0, paras.LastIndexOf(',')) + ")";
            values = values.Substring(0, values.LastIndexOf(',')) + ")";
            return paras + " VALUES " + values;
        }

        public static MySqlDbType ToMysqlType(this System.Type t)
        {
            switch (t.Name)
            {
                case "String":
                    {
                        return MySqlDbType.VarChar;
                    }
                case "Int32":
                    {
                        return MySqlDbType.Int32;
                    }
                default:
                    {
                        return MySqlDbType.Text;
                    }
            }

        }
    }
}