var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET Customer page. */

router.get("/data", authentication_mdl.is_login, function(req, res, next) {
    req.getConnection(function(err, connection) {
        var query = connection.query(
            "SELECT * FROM barang",
            function(err, rows) {
                if (err) var errornya = ("Error Selecting : %s ", err);
                req.flash("msg_error", errornya);
                res.render("barang/list", {
                    title: "Databarang",
                    data: rows,
                    session_store: req.session,
                });
            }
        );
        //console.log(query.sql);
    });
});

router.delete(
    "/delete/(:id)",
    authentication_mdl.is_login,
    function(req, res, next) {
        req.getConnection(function(err, connection) {
            var barang = {
                id: req.params.id,
            };

            var delete_sql = "delete from barang where ?";
            req.getConnection(function(err, connection) {
                var query = connection.query(
                    delete_sql,
                    barang,
                    function(err, result) {
                        if (err) {
                            var errors_detail = ("Error Delete : %s ", err);
                            req.flash("msg_error", errors_detail);
                            res.redirect("/databarang/data");
                        } else {
                            req.flash("msg_info", "Barang Berhasil di Hapus");
                            res.redirect("/databarang/data");
                        }
                    }
                );
            });
        });
    }
);
router.get(
    "/edit/(:id)",
    authentication_mdl.is_login,
    function(req, res, next) {
        req.getConnection(function(err, connection) {
            var query = connection.query(
                "SELECT * FROM barang where id=" + req.params.id,
                function(err, rows) {
                    if (err) {
                        var errornya = ("Error Selecting : %s ", err);
                        req.flash("msg_error", errors_detail);
                        res.redirect("/databarang");
                    } else {
                        if (rows.length <= 0) {
                            req.flash("msg_error", "Barang can't be find!");
                            res.redirect("/databarang");
                        } else {
                            console.log(rows);
                            res.render("barang/edit", {
                                title: "Edit ",
                                data: rows[0],
                                session_store: req.session,
                            });
                        }
                    }
                }
            );
        });
    }
);
router.put(
    "/edit/(:id)",
    authentication_mdl.is_login,
    function(req, res, next) {
        req.assert("nama_barang", "Please fill the name").notEmpty();
        var errors = req.validationErrors();
        if (!errors) {
            v_nama_barang = req.sanitize("nama_barang").escape().trim();
            v_harga = req.sanitize("harga").escape().trim();
            v_stok = req.sanitize("stok").escape().trim();
            v_jenis_barang = req.sanitize("jenis_barang").escape();

            var barang = {
                nama_barang: v_nama_barang,
                harga: v_harga,
                stok: v_stok,
                jenis_barang: v_jenis_barang,
            };

            var update_sql = "update barang SET ? where id = " + req.params.id;
            req.getConnection(function(err, connection) {
                var query = connection.query(
                    update_sql,
                    barang,
                    function(err, result) {
                        if (err) {
                            var errors_detail = ("Error Update : %s ", err);
                            req.flash("msg_error", errors_detail);
                            res.render("barang/edit", {
                                nama_barang: req.param("nama_barang"),
                                harga: req.param("harga"),
                                stok: req.param("stok"),
                                jenis_barang: req.param("jenis_barang"),
                            });
                        } else {
                            req.flash("msg_info", "Barang Berhasil di Edit");
                            res.redirect("/databarang/edit/" + req.params.id);
                        }
                    }
                );
            });
        } else {
            console.log(errors);
            errors_detail = "<p>Sory there are error</p><ul>";
            for (i in errors) {
                error = errors[i];
                errors_detail += "<li>" + error.msg + "</li>";
            }
            errors_detail += "</ul>";
            req.flash("msg_error", errors_detail);
            res.redirect("/databarang/edit/" + req.params.id);
        }
    }
);

router.post("/add", authentication_mdl.is_login, function(req, res, next) {
    req.assert("nama_barang", "Tolong isi data secara lengkap").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
        v_nama_barang = req.sanitize("nama_barang").escape().trim();
        v_harga = req.sanitize("harga").escape().trim();
        v_stok = req.sanitize("stok").escape().trim();
        v_jenis_barang = req.sanitize("jenis_barang").escape();

        var barang = {
            nama_barang: v_nama_barang,
            harga: v_harga,
            stok: v_stok,
            jenis_barang: v_jenis_barang,
        };

        var insert_sql = "INSERT INTO barang SET ?";
        req.getConnection(function(err, connection) {
            var query = connection.query(
                insert_sql,
                barang,
                function(err, result) {
                    if (err) {
                        var errors_detail = ("Error Insert : %s ", err);
                        req.flash("msg_error", errors_detail);
                        res.render("barang/add-barang", {
                            nama_barang: req.param("nama_barang"),
                            harga: req.param("harga"),
                            stok: req.param("stok"),
                            jenis_barang: req.param("jenis_barang"),
                            session_store: req.session,
                        });
                    } else {
                        req.flash("msg_info", "Barang Berhasil di Tambah");
                        res.redirect("/databarang/data");
                    }
                }
            );
        });
    } else {
        console.log(errors);
        errors_detail = "<p>Maaf Tidak Bisa di Tambah</p><ul>";
        for (i in errors) {
            error = errors[i];
            errors_detail += "<li>" + error.msg + "</li>";
        }
        errors_detail += "</ul>";
        req.flash("msg_error", errors_detail);
        res.render("barang/add-barang", {
            nama_barang: req.param("nama_barang"),
            harga: req.param("harga"),
            session_store: req.session,
        });
    }
});

router.get("/add", authentication_mdl.is_login, function(req, res, next) {
    res.render("barang/add-barang", {
        title: "Add New Barang",
        name: "",
        email: "",
        phone: "",
        address: "",
        session_store: req.session,
    });
});

module.exports = router;