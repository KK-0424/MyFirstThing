using System;
using System.Collections;
using System.Configuration;
using MySql.Data;
using MySql.Data.MySqlClient;
using System.Data;

namespace WebIm
{
    /// <summary>
    ///MYSQLHelper ��ժҪ˵��
    /// </summary>
    public abstract class MySqlHelper
    {
        /// <summary>�������ݿ�����.    
        /// </summary>    
        /// <returns>����MySqlConnection����</returns>    
        public static MySqlConnection GetMySqlConnection()
        {
            string connStr = ConfigurationManager.AppSettings["MysqlConnection"];
            //string connStr = "server=localhost;database=AutomationManager;Uid=root;Pwd=wudonghai";
            MySqlConnection myCon = new MySqlConnection(connStr);

            return myCon;
        }

        /// <summary>ִ��MySqlCommand    
        /// </summary>    
        /// <param name="sqlCommand">SQL���</param>
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
        /// �����¼
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
        /// ���¼�¼
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
        /// ɾ����¼
        /// </summary>
        public static void Delete(string tableName, string filter)
        {
            string commandText = string.Format("DELETE FROM {0} {1}", tableName, filter);
            ExecuteMySqlCommand(commandText);
        }

        /// <summary>
        /// ��ѯ����
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
        /// ��ѯ����
        /// </summary>
        public static DataTable Query(string commandText)
        {
            DataTable table = new DataTable();
            MySqlDataAdapter adapter = GetMySqlAdapter(commandText);
            adapter.Fill(table);

            return table;
        }

        /// <summary>
        /// ��ָ��������л�ȡ���ֵ
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

        /// <summary>����һ��MySqlDataReader����    
        /// </summary>    
        /// <param name="M_str_sqlstr">SQL���</param>    
        /// <returns>����MySqlDataReader����</returns>    
        public static MySqlDataReader GetMySqlReader(string sqlCommand)
        {
            MySqlConnection mysqlcon = GetMySqlConnection();
            MySqlCommand mysqlcom = new MySqlCommand(sqlCommand, mysqlcon);
            mysqlcon.Open();
            MySqlDataReader mysqlreader = mysqlcom.ExecuteReader(CommandBehavior.CloseConnection);

            return mysqlreader;
        }

        /// <summary>����һ��MySqlDataAdapter����    
        /// </summary>    
        /// <param name="M_str_sqlstr">SQL���</param>    
        /// <returns>����MySqlDataAdapter����</returns>    
        public static MySqlDataAdapter GetMySqlAdapter(string sqlCommand)
        {
            MySqlConnection mysqlcon = GetMySqlConnection();
            MySqlCommand mySQLCommand = new MySqlCommand(sqlCommand, mysqlcon);
            MySqlDataAdapter mySQLAdapter = new MySqlDataAdapter(mySQLCommand);

            return mySQLAdapter;
        }
    }
}