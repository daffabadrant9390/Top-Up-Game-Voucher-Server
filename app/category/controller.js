const CategoryModel = require('./model');

module.exports = {
  index: async (req, res) => {
    try {
      /*
        Showing the Category data to index page
          - Grab the Category data from CategoryModel
          - Send the Category data to view_category.ejs, then do looping to show the data on ejs file
      */
      const categoryData = await CategoryModel.find();
      /*
        Get alert / notification data using connect-flash
          - define the variable and key for alertMessage
          - define the variable and key for alertStatus
          - Send the alertMessage and alertStatus to index page (/category)
      */
      const alertMessage = req.flash('alertMessage');
      const alertStatus = req.flash('alertStatus');
      const alertData = {
        message: alertMessage || '',
        status: alertStatus || '',
      };

      res.render('admin/category/view_category', {
        categoryData,
        alertData,
      });
    } catch (error) {
      console.log(error);
    }
  },
  renderCreateCategoryPage: async (req, res) => {
    try {
      res.render('admin/category/create_category');
    } catch (error) {
      console.log(error);
    }
  },
  createCategory: async (req, res) => {
    try {
      const { category_name } = req.body;
      // const newCategory = await CategoryModel({ name: category_name });
      // await newCategory.save();

      const insertNewCategory = await CategoryModel.create({
        name: category_name,
      });

      if (!!insertNewCategory) {
        req.flash('alertMessage', 'Success create new category!');
        req.flash('alertStatus', 'success');
        res.redirect('/category');
      } else {
        res.send('Error creating new category!');
      }
    } catch (error) {
      console.log(error);
      req.flash('alertMessage', 'Failed create new category!');
      req.flash('alertStatus', 'danger');
    }
  },
  renderEditCategoryPage: async (req, res) => {
    try {
      const { id } = req.params;
      const getCategoryById = await CategoryModel.findOne({
        _id: id,
      });

      if (!!getCategoryById) {
        console.log('getCategoryById: ', getCategoryById);

        res.render('admin/category/edit_category', {
          categoryData: getCategoryById,
        });
      } else {
        res.send('The id you are looking for is not exist');
      }
    } catch (error) {
      console.log(error);
    }
  },
  editCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { category_name } = req.body;

      const editCategoryById = await CategoryModel.findOneAndUpdate(
        {
          _id: id,
        },
        { name: category_name }
      );

      if (!!editCategoryById) {
        req.flash('alertMessage', 'Success edit category!');
        req.flash('alertStatus', 'success');
        res.redirect('/category');
      } else {
        res.send('Error Edit Category Data');
      }
    } catch (error) {
      console.log(error);
      req.flash('alertMessage', 'Failed edit category!');
      req.flash('alertStatus', 'danger');
    }
  },
  deleteCategory: async (req, res) => {
    try {
      // console.log(req.body);
      // alert('delete category button clicked');
      const { id } = req.params;
      const deleteCategoryData = await CategoryModel.findOneAndRemove({
        _id: id,
      });
      if (!!deleteCategoryData) {
        req.flash('alertMessage', 'Success delete category!');
        req.flash('alertStatus', 'success');
        res.redirect('/category');
      } else {
        res.send('Error Delete Category Data');
      }
    } catch (error) {
      console.log(error);
      req.flash('alertMessage', 'Failed delete category!');
      req.flash('alertStatus', 'danger');
    }
  },
};
