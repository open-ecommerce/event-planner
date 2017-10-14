<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210745_setting extends Migration
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
            '{{%setting}}',
            [
                'id'=> $this->primaryKey(11),
                'title'=> $this->string(250)->notNull(),
                'code'=> $this->string(45)->notNull(),
                'value'=> $this->string(90)->notNull(),
                'description'=> $this->text()->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%setting}}');
    }
}
