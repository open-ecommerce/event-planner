<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205337_book_period extends Migration
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
            '{{%book_period}}',
            [
                'id'=> $this->primaryKey(11),
                'period'=> $this->string(100)->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%book_period}}');
    }
}
