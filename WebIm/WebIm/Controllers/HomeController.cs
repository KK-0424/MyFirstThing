using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebIm.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {

            ViewBag.PageTitle = ConfigurationManager.AppSettings["PageTitle"];
            Session["a"] = "b";
            Session.Timeout = 120;


            return View();
        }

        public ActionResult Par()
        {
            ViewBag.PageTitle = ConfigurationManager.AppSettings["PageTitle"];
            ViewBag.UserToken = Session["usertoken"];
            ViewBag.ResourceUrl = ConfigurationManager.AppSettings["ResourceUrl"];
            ViewBag.RootPath = ConfigurationManager.AppSettings["RootPath"];
            return View();
        }
    }
}
