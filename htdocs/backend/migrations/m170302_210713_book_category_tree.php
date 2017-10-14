<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210713_book_category_tree extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%book_category_tree}}',
            [
                'id'=> $this->primaryKey(11),
                'root'=> $this->integer(11)->null()->defaultValue(null),
                'lft'=> $this->integer(11)->notNull(),
                'rgt'=> $this->integer(11)->notNull(),
                'lvl'=> $this->smallInteger(5)->notNull(),
                'name'=> $this->string(60)->notNull(),
                'icon'=> $this->string(255)->null()->defaultValue(null),
                'icon_type'=> $this->smallInteger(1)->notNull()->defaultValue(1),
                'active'=> $this->smallInteger(1)->notNull()->defaultValue(1),
                'selected'=> $this->smallInteger(1)->notNull()->defaultValue(0),
                'disabled'=> $this->smallInteger(1)->notNull()->defaultValue(0),
                'readonly'=> $this->smallInteger(1)->notNull()->defaultValue(0),
                'visible'=> $this->smallInteger(1)->notNull()->defaultValue(1),
                'collapsed'=> $this->smallInteger(1)->notNull()->defaultValue(0),
                'movable_u'=> $this->smallInteger(1)->notNull()->defaultValue(1),
                'movable_d'=> $this->smallInteger(1)->notNull()->defaultValue(1),
                'movable_l'=> $this->smallInteger(1)->notNull()->defaultValue(1),
                'movable_r'=> $this->smallInteger(1)->notNull()->defaultValue(1),
                'removable'=> $this->smallInteger(1)->notNull()->defaultValue(1),
                'removable_all'=> $this->smallInteger(1)->notNull()->defaultValue(0),
            ],$tableOptions
        );
        $this->createIndex('tbl_product_NK1','{{%book_category_tree}}','root',false);
        $this->createIndex('tbl_product_NK2','{{%book_category_tree}}','lft',false);
        $this->createIndex('tbl_product_NK3','{{%book_category_tree}}','rgt',false);
        $this->createIndex('tbl_product_NK4','{{%book_category_tree}}','lvl',false);
        $this->createIndex('tbl_product_NK5','{{%book_category_tree}}','active',false);
    }

    public function safeDown()
    {
        $this->dropIndex('tbl_product_NK1', '{{%book_category_tree}}');
        $this->dropIndex('tbl_product_NK2', '{{%book_category_tree}}');
        $this->dropIndex('tbl_product_NK3', '{{%book_category_tree}}');
        $this->dropIndex('tbl_product_NK4', '{{%book_category_tree}}');
        $this->dropIndex('tbl_product_NK5', '{{%book_category_tree}}');
        $this->dropTable('{{%book_category_tree}}');
    }
}
