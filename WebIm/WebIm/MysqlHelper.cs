using System;
using System.Collections;
using System.Configuration;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;

namespace WebIm
{
    /// <summary>
    ///MYSQLHelper 的摘要说明
    /// </summary>
    public abstract class MySqlHelper
    {
        /// <summary>建立数据库连接.    
        /// </summary>    
        /// <returns>返回MySqlConnection对象</returns>    
        public static MySqlConnection GetMySqlConnection()
        {
            string connStr = ConfigurationManager.AppSettings["MysqlConnection"];
            //string connStr = "server=localhost;database=AutomationManager;Uid=root;Pwd=wudonghai";
            MySqlConnection myCon = new MySqlConnection(connStr);

            return myCon;
        }

        /// <summary>执行MySqlCommand    
        /// </summary>    
        /// <param name="sqlCommand">SQL语句</param>
        public static void ExecuteMySqlCommand(string sqlCommand)
        {
            //if (sqlCommand.Contains('\\'))
            //{
            //    sqlCommand = sqlCommand.Replace(@"\", @"\\");
            //}

            MySqlConnection mysqlcon = GetMySqlConnection();
            mysqlcon.Open();
            MySqlCommand mysqlcom = new MySqlCommand(sqlCommand, mysqlcon);
            mysqlcom.ExecuteNonQuery();
            mysqlcom.Dispose();
            mysqlcon.Close();
            mysqlcon.Dispose();
        }

        /// <summary>
        /// 插入记录
        /// </summary>
        public static int Insert(string tableName, string filter)
        {
            int newRecordId = 0;
            string commandText = string.Format("INSERT INTO {0} {1}", tableName, filter);
            if (commandText.Contains("\\"))
            {
                commandText = commandText.Replace(@"\", @"\\");
            }
            string getIdCommandText = "SELECT LAST_INSERT_ID()";


            MySqlConnection mysqlcon = GetMySqlConnection();
            mysqlcon.Open();
            MySqlCommand mysqlcom = new MySqlCommand(commandText, mysqlcon);
            mysqlcom.ExecuteNonQuery();

            MySqlCommand getIdCommand = new MySqlCommand(getIdCommandText, mysqlcon);

            MySqlDataReader mysqlreader = getIdCommand.ExecuteReader(CommandBehavior.CloseConnection);

            if (mysqlreader.Read())
            {
                newRecordId = Convert.ToInt32(mysqlreader["LAST_INSERT_ID()"]);
            }

            mysqlcom.Dispose();
            mysqlcon.Close();
            mysqlcon.Dispose();

            return newRecordId;
        }

        /// <summary>
        /// 更新记录
        /// </summary>
        public static void Update(string tableName, string filter)
        {
            string commandText = string.Format("UPDATE {0} SET {1}", tableName, filter);

            if (commandText.Contains("\\"))
            {
                commandText = commandText.Replace(@"\", @"\\");
            }

            ExecuteMySqlCommand(commandText);
        }

        /// <summary>
        /// 删除记录
        /// </summary>
        public static void Delete(string tableName, string filter)
        {
            string commandText = string.Format("DELETE FROM {0} {1}", tableName, filter);
            ExecuteMySqlCommand(commandText);
        }

        /// <summary>
        /// 查询数据
        /// </summary>
        public static DataTable Query(string tableName, string filter)
        {
            string sqlCommand;
            if (string.IsNullOrEmpty(filter))
            {
                sqlCommand = "SELECT * FROM " + tableName;
            }
            else
            {
                sqlCommand = "SELECT * FROM " + tableName + " WHERE " + filter;
            }
            //MySqlDataReader reader = GetMySqlReader(sqlCommand);
            DataTable table = new DataTable();
            MySqlDataAdapter adapter = GetMySqlAdapter(sqlCommand);
            adapter.Fill(table);

            adapter.Dispose();

            return table;
        }

        /// <summary>
        /// 查询数据
        /// </summary>
        public static DataTable Query(string commandText)
        {
            DataTable table = new DataTable();
            MySqlDataAdapter adapter = GetMySqlAdapter(commandText);
            adapter.Fill(table);

            return table;
        }

        /// <summary>
        /// 从指定表和列中获取最大值
        /// </summary>
        public static Int32 GetMaxValue(string columnName, string tableName, string filter)
        {
            Int32 result = 0;
            string commandText;
            if (filter == null || filter == string.Empty)
            {
                commandText =
                    string.Format("SELECT MAX({0}) FROM {1}",
                    columnName, tableName);
            }
            else
            {
                commandText =
                    string.Format("SELECT MAX({0}) FROM {1} WHERE {2}",
                    columnName, tableName, filter);
            }

            MySqlConnection mysqlcon = GetMySqlConnection();
            MySqlCommand mysqlcom = new MySqlCommand(commandText, mysqlcon);
            mysqlcon.Open();

            string resultString = mysqlcom.ExecuteScalar().ToString();
            if (!string.IsNullOrEmpty(resultString))
            {
                result = Convert.ToInt32(resultString);
            }

            mysqlcom.Dispose();
            mysqlcon.Close();
            mysqlcon.Dispose();

            return result;
        }

        /// <summary>创建一个MySqlDataReader对象    
        /// </summary>    
        /// <param name="M_str_sqlstr">SQL语句</param>    
        /// <returns>返回MySqlDataReader对象</returns>    
        public static MySqlDataReader GetMySqlReader(string sqlCommand)
        {
            MySqlConnection mysqlcon = GetMySqlConnection();
            MySqlCommand mysqlcom = new MySqlCommand(sqlCommand, mysqlcon);
            mysqlcon.Open();
            MySqlDataReader mysqlreader = mysqlcom.ExecuteReader(CommandBehavior.CloseConnection);

            return mysqlreader;
        }

        /// <summary>创建一个MySqlDataAdapter对象    
        /// </summary>    
        /// <param name="M_str_sqlstr">SQL语句</param>    
        /// <returns>返回MySqlDataAdapter对象</returns>    
        public static MySqlDataAdapter GetMySqlAdapter(string sqlCommand)
        {
            MySqlConnection mysqlcon = GetMySqlConnection();
            MySqlCommand mySQLCommand = new MySqlCommand(sqlCommand, mysqlcon);
            MySqlDataAdapter mySQLAdapter = new MySqlDataAdapter(mySQLCommand);

            return mySQLAdapter;
        }
    }
}