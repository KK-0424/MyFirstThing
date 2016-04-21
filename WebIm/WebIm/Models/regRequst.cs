using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebIm.Models
{
    public class regRequst
    {
        public string userId { get; set; }

        public string userName { get; set; }

        public string password { get; set; }

        public string nickName { get; set; }

        public string email { get; set; }

        public string isDelete { get; set; }
    }
}