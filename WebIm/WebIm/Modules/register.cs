namespace WebIm.Modules
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("myfirstthingdb.register")]
    public partial class register
    {
        [Key]
        [Column(Order = 0, TypeName = "text")]
        [StringLength(65535)]
        public string userId { get; set; }

        [StringLength(255)]
        public string nickName { get; set; }

        [StringLength(255)]
        public string email { get; set; }

        [Key]
        [Column(Order = 1)]
        public sbyte isDelete { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(255)]
        public string password { get; set; }

        [Key]
        [Column(Order = 3)]
        [StringLength(255)]
        public string userName { get; set; }
    }
}
