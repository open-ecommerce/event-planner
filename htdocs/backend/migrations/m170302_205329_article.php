<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205329_article extends Migration
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
            '{{%article}}',
            [
                'id'=> $this->primaryKey(11),
                'slug'=> $this->string(1024)->notNull(),
                'title'=> $this->string(512)->notNull(),
                'body'=> $this->text()->notNull(),
                'view'=> $this->string(255)->null()->defaultValue(null),
                'category_id'=> $this->integer(11)->null()->defaultValue(null),
                'thumbnail_base_url'=> $this->string(1024)->null()->defaultValue(null),
                'thumbnail_path'=> $this->string(1024)->null()->defaultValue(null),
                'status'=> $this->smallInteger(6)->notNull()->defaultValue(0),
                'created_by'=> $this->integer(11)->null()->defaultValue(null),
                'updated_by'=> $this->integer(11)->null()->defaultValue(null),
                'published_at'=> $this->integer(11)->null()->defaultValue(null),
                'created_at'=> $this->integer(11)->null()->defaultValue(null),
                'updated_at'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
        $this->createIndex('fk_article_author','{{%article}}','created_by',false);
        $this->createIndex('fk_article_updater','{{%article}}','updated_by',false);
        $this->createIndex('fk_article_category','{{%article}}','category_id',false);
    }

    public function safeDown()
    {
        $this->dropIndex('fk_article_author', '{{%article}}');
        $this->dropIndex('fk_article_updater', '{{%article}}');
        $this->dropIndex('fk_article_category', '{{%article}}');
        $this->dropTable('{{%article}}');
    }
}
