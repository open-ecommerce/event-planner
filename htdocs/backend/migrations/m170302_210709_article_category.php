<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210709_article_category extends Migration
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
            '{{%article_category}}',
            [
                'id'=> $this->primaryKey(11),
                'slug'=> $this->string(1024)->notNull(),
                'title'=> $this->string(512)->notNull(),
                'body'=> $this->text()->null()->defaultValue(null),
                'parent_id'=> $this->integer(11)->null()->defaultValue(null),
                'status'=> $this->smallInteger(6)->notNull()->defaultValue(0),
                'created_at'=> $this->integer(11)->null()->defaultValue(null),
                'updated_at'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
        $this->createIndex('fk_article_category_section','{{%article_category}}','parent_id',false);
    }

    public function safeDown()
    {
        $this->dropIndex('fk_article_category_section', '{{%article_category}}');
        $this->dropTable('{{%article_category}}');
    }
}
