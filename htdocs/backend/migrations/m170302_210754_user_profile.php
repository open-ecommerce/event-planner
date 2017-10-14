<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210754_user_profile extends Migration
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
            '{{%user_profile}}',
            [
                'user_id'=> $this->primaryKey(11),
                'publishing_house_id'=> $this->integer(11)->null()->defaultValue(null),
                'firstname'=> $this->string(255)->null()->defaultValue(null),
                'lastname'=> $this->string(255)->null()->defaultValue(null),
                'avatar_path'=> $this->string(255)->null()->defaultValue(null),
                'avatar_base_url'=> $this->string(255)->null()->defaultValue(null),
                'about'=> $this->text()->null()->defaultValue(null),
                'job_title'=> $this->text()->null()->defaultValue(null),
                'books_published'=> $this->text()->null()->defaultValue(null),
                'wished_you_published'=> $this->text()->null()->defaultValue(null),
                'categories_tree'=> $this->string(100)->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%user_profile}}');
    }
}
