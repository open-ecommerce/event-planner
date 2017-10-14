<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205332_author extends Migration
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
            '{{%author}}',
            [
                'id'=> $this->primaryKey(11),
                'name'=> $this->string(200)->notNull(),
                'thumbnail_base_url'=> $this->string(1024)->null()->defaultValue(null),
                'thumbnail_path'=> $this->string(1024)->null()->defaultValue(null),
                'bio'=> $this->text()->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%author}}');
    }
}
