<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205359_page extends Migration
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
            '{{%page}}',
            [
                'id'=> $this->primaryKey(11),
                'slug'=> $this->string(2048)->notNull(),
                'title'=> $this->string(512)->notNull(),
                'body'=> $this->text()->notNull(),
                'view'=> $this->string(255)->null()->defaultValue(null),
                'status'=> $this->smallInteger(6)->notNull(),
                'created_at'=> $this->integer(11)->null()->defaultValue(null),
                'updated_at'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%page}}');
    }
}
