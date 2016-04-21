namespace WebIm.Modules
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("myfirstthingdb.login")]
    public partial class login
    {
        [Key]
        [Column(Order = 0, TypeName = "text")]
        [StringLength(65535)]
        public string userId { get; set; }

        [Key]
        [Column(Order = 1)]
        [StringLength(255)]
        public string userName { get; set; }

        [Key]
        [Column(Order = 2)]
        [StringLength(255)]
        public string password { get; set; }

        [Key]
        [Column(Order = 3)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int isDelete { get; set; }
    }
}
