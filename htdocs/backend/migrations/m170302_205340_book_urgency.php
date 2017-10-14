<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205340_book_urgency extends Migration
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
            '{{%book_urgency}}',
            [
                'id'=> $this->primaryKey(11),
                'urgency'=> $this->string(50)->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%book_urgency}}');
    }
}
