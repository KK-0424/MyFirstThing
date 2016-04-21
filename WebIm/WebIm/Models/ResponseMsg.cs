using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebIm.Controllers
{
    public class ResponseMsg
    {
        public string code { get; set; }

        public string msg { get; set; }
    }

    public class ResponseMsg<T>
    {
        public string code { get; set; }

        public string msg { get; set; }

        public T ext { get; set; }
    }
}