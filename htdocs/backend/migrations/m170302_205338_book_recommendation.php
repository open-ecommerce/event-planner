<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_205338_book_recommendation extends Migration
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
            '{{%book_recommendation}}',
            [
                'id'=> $this->primaryKey(11),
                'recommendation'=> $this->string(50)->notNull()->defaultValue('0'),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%book_recommendation}}');
    }
}
